import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'busy' | 'away' | 'offline';

export interface AppAvatarProps {
  name?: string;
  imageUri?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  style?: StyleProp<ViewStyle>;
}

const AVATAR_COLORS = [
  '#007AFF',
  '#5856D6',
  '#FF2D55',
  '#FF9500',
  '#34C759',
  '#00C7BE',
  '#AF52DE',
];

function getInitials(name?: string): string {
  if (!name || name.trim().length === 0) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getBackgroundColor(name?: string): string {
  if (!name) return '#007AFF';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function AppAvatar({
  name,
  imageUri,
  size = 'md',
  status,
  style,
}: AppAvatarProps) {
  const theme = useTheme();

  const getDimension = () => {
    switch (size) {
      case 'sm':
        return { size: 28, fontSize: 11, statusSize: 8 };
      case 'lg':
        return { size: 52, fontSize: 18, statusSize: 13 };
      case 'xl':
        return { size: 68, fontSize: 24, statusSize: 16 };
      case 'md':
      default:
        return { size: 40, fontSize: 14, statusSize: 10 };
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return '#34C759';
      case 'busy':
        return '#FF3B30';
      case 'away':
        return '#FF9500';
      case 'offline':
      default:
        return '#8E8E93';
    }
  };

  const { size: dim, fontSize, statusSize } = getDimension();
  const initials = getInitials(name);
  const bgColor = getBackgroundColor(name);

  return (
    <View style={[styles.wrapper, { width: dim, height: dim }, style]}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={[styles.image, { width: dim, height: dim, borderRadius: dim / 2 }]}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: dim,
              height: dim,
              borderRadius: dim / 2,
              backgroundColor: bgColor,
            },
          ]}
        >
          <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
        </View>
      )}

      {status && (
        <View
          style={[
            styles.statusBadge,
            {
              width: statusSize,
              height: statusSize,
              borderRadius: statusSize / 2,
              backgroundColor: getStatusColor(),
              borderColor: theme.background,
              borderWidth: statusSize > 10 ? 2 : 1.5,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#ffffff',
    fontWeight: '700',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
