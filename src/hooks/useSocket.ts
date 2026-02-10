import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import { AppointmentRequestEvent, OnlineUsersEvent, RewardEvent } from '@/api/types';

const SOCKET_URL = 'https://api.bookb.app';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { user, role, salonId } = useAuthStore();
  const { setOnlineUsers, incrementNotificationCount } = useAppStore();

  const connect = useCallback(() => {
    if (!user?._id || socketRef.current?.connected) return;

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      query: {
        id: user._id,
        timezone,
        user: user._id,
        role: role || '',
        salon: salonId || '',
      },
    });

    socketRef.current.on('connect', () => {
      // connected
    });

    socketRef.current.on('online-users', (data: OnlineUsersEvent) => {
      setOnlineUsers(data.onlineUsers);
    });

    socketRef.current.on('disconnect', () => {
      // disconnected
    });

    return socketRef.current;
  }, [user?._id, role, salonId, setOnlineUsers]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const onAppointmentRequest = useCallback(
    (callback: (data: AppointmentRequestEvent) => void) => {
      socketRef.current?.on('appointment-request', callback);
      return () => {
        socketRef.current?.off('appointment-request', callback);
      };
    },
    []
  );

  const onFirstLoginReward = useCallback(
    (callback: (data: RewardEvent) => void) => {
      socketRef.current?.on('firstLogin', callback);
      return () => {
        socketRef.current?.off('firstLogin', callback);
      };
    },
    []
  );

  const onFirstAppointmentReward = useCallback(
    (callback: (data: RewardEvent[]) => void) => {
      socketRef.current?.on('first-appointment-reward', callback);
      return () => {
        socketRef.current?.off('first-appointment-reward', callback);
      };
    },
    []
  );

  const onCompleteProfile = useCallback(
    (callback: (data: RewardEvent) => void) => {
      socketRef.current?.on('complete-profile', callback);
      return () => {
        socketRef.current?.off('complete-profile', callback);
      };
    },
    []
  );

  const emitFirstLogin = useCallback(() => {
    socketRef.current?.emit('first-login', { user: user?._id });
  }, [user?._id]);

  const emitFirstAppointment = useCallback(() => {
    socketRef.current?.emit('first-appointment-booked', { user: user?._id });
  }, [user?._id]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    socket: socketRef.current,
    connect,
    disconnect,
    onAppointmentRequest,
    onFirstLoginReward,
    onFirstAppointmentReward,
    onCompleteProfile,
    emitFirstLogin,
    emitFirstAppointment,
  };
}
