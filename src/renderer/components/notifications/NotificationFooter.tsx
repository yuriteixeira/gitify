import type { FC, MouseEvent } from 'react';

import { RelativeTime, Stack, Text } from '@primer/react';

import { type GitifyNotification, type SubjectType, Opacity, Size } from '../../types';

import { openUserProfile } from '../../utils/system/links';
import { cn } from '../../utils/ui/cn';
import { AvatarWithFallback } from '../avatars/AvatarWithFallback';
import { MetricGroup } from '../metrics/MetricGroup';

export interface NotificationFooterProps {
  notification: GitifyNotification;
}

const subjectTypesWithAuthorDetails: SubjectType[] = ['Issue', 'PullRequest'];

function getAuthorLogin(notification: GitifyNotification): string | undefined {
  if (!subjectTypesWithAuthorDetails.includes(notification.subject.type)) {
    return undefined;
  }

  return notification.subject.author?.login;
}

function getReasonDescription(notification: GitifyNotification): string {
  const authorLogin = getAuthorLogin(notification);

  if (!authorLogin) {
    return notification.reason.description;
  }

  return `${notification.reason.description} Author: ${authorLogin}.`;
}

interface NotificationTimestampProps {
  notification: GitifyNotification;
}

const NotificationTimestamp: FC<NotificationTimestampProps> = ({
  notification,
}: NotificationTimestampProps) => (
  <Stack direction="horizontal" gap="none">
    <Text className="pr-1" title={getReasonDescription(notification)}>
      {notification.reason.title}
    </Text>
    <RelativeTime datetime={notification.updatedAt} />
  </Stack>
);

export const NotificationFooter: FC<NotificationFooterProps> = ({
  notification,
}: NotificationFooterProps) => (
  <Stack
    align="center"
    className={cn('text-xs', Opacity.MEDIUM)}
    direction="horizontal"
    gap="condensed"
    wrap="wrap"
  >
    {notification.subject.user ? (
      <button
        data-testid="view-profile"
        onClick={(event: MouseEvent<HTMLElement>) => {
          // Don't trigger onClick of parent element.
          event.stopPropagation();
          openUserProfile(notification.subject.user!);
        }}
        title={notification.subject.user.login}
        type="button"
      >
        <AvatarWithFallback
          alt={notification.subject.user.login}
          size={Size.SMALL}
          src={notification.subject.user.avatarUrl}
          userType={notification.subject.user.type}
        />
      </button>
    ) : (
      <AvatarWithFallback size={Size.SMALL} userType={notification.display.defaultUserType} />
    )}

    <NotificationTimestamp notification={notification} />

    <MetricGroup notification={notification} />
  </Stack>
);
