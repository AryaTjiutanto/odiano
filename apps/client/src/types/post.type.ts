import type { InfiniteQuery, PostDTO } from "@connect/shared";
import type { InfiniteData } from "@tanstack/react-query";

export type InfiniteQueryPostDTO = InfiniteData<InfiniteQuery<PostDTO[]>>;