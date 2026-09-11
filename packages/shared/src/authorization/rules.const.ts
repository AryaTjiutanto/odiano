import { Action, ACTIONS } from "./action.const";
import { Role, ROLES } from "./role.const";
import { Subject, SUBJECTS } from "./subject.const";

type Rule = {
    action: Action,
    subject: Subject,    
    conditions?: {
        [key: string]: any,
    }
}

export const getRules = (userId: string, role: Role) => {
    let baseRules : Rule[] = []

    if (role === ROLES.USER) {
        baseRules.push(
            {
                action: ACTIONS.DELETE,
                subject: SUBJECTS.POST,
                conditions: { author: userId },
            },
            {
                action : ACTIONS.DELETE,
                subject : SUBJECTS.COMMENT,
                conditions : { author : userId },
            }
        )
    } else if (role === ROLES.ADMIN) {
        baseRules.push(
            {
                action: ACTIONS.UPDATE,
                subject : SUBJECTS.REPORT,
            },
            {
                action: ACTIONS.DELETE,
                subject: SUBJECTS.POST,
            },
        )
    }

    return baseRules;
};