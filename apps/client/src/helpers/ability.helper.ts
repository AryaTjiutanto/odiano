import { createMongoAbility, type ForcedSubject, type MongoAbility, type MongoQuery } from "@casl/ability"
import type { Action, Subject } from "@odiano/shared"

type AppSubject = Subject | ForcedSubject<string>

export type AppAbility = MongoAbility<[Action, AppSubject], MongoQuery>

export const createAppAbility = (rules : any[]) => {
    return createMongoAbility<AppAbility>(rules);
}