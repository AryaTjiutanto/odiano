import { ACTIONS } from "./action.const";
import { Role, ROLES } from "./role.const";
import { SUBJECTS } from "./subject.const";

export const getRules = (userId: string, role: Role) => {
    if (role === ROLES.USER) {
        return [
            {
                action: ACTIONS.DELETE,
                subject: SUBJECTS.POST,
                conditions: { author: userId },
            },
        ]
    }
};