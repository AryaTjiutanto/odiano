import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { getRules } from "@odiano/shared";

export const defineAbilityFor = (userId : string, role : string) => {
    const {can, build} = new AbilityBuilder(createMongoAbility);

    const rules = getRules(userId, role);

    rules.forEach(rule => {
        can(rule.action, rule.subject, rule.conditions);
    });

    return build();
}