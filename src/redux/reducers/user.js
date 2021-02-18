export const loginUser = (preState = {}, { type, data }) => {
    if (type !== 'userInfo') return preState;
    return data;
}