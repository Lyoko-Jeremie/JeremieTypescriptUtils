import {TSchema} from "@sinclair/typebox";
import {TypeCheck} from "@sinclair/typebox/compiler";

export type GetObjectFromCompiledTypeBox<CompiledTypeBox extends TypeCheck<TSchema>> = ReturnType<CompiledTypeBox['Decode']>

