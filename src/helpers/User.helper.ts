import { User } from '../types';

export const filterUniqueUsers = (users: User[]): User[] => {
    const uniqueUserMap = new Map<User['id'], User>();

    users.forEach((user) => {
        if (uniqueUserMap.has(user.id)) return;

        uniqueUserMap.set(user.id, user);
    });

    const uniqueUsers = Array.from(uniqueUserMap.values());

    return uniqueUsers;
};
