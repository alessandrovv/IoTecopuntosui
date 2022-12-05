export class ResponseJson<T> {
    ok: boolean;
    message: string;
    result: T;
    data: Array<T>;
    total: number;
}
