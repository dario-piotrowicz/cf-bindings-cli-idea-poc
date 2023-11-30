declare global {
    interface Env {
    }
}

export type RequestContext = {
    req: any,
    // Note: here the MY_KV type is hardcoded, maybe we could do something clever
    //       and get the types correctly inferred in dev mode (with a dev cli option?)
    //       otherwise this env object could be a Record<string, Binding> or something
    //       like that
    env: Env,
    ctx: any
};
