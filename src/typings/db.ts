export interface IUser {
    id: number;
    nickname: string;
    email: string;
    Workspaces: ITalkspace[];
}

export interface IUserWithOnline extends IUser {
    online: boolean;
}

export interface IChannel {
    id: number;
    name: string;
    private: boolean;
    WorkspaceId: number;
}

export interface IChat {
    id: number;
    UserId: number;
    User: IUser;
    content: string;
    createdAt: Date;
    ChannelId: number;
    Channel: IChannel;
}

export interface IDM {
    id: number;
    SenderId: number;
    Sender: IUser;
    ReceiverId: number;
    Receiver: IUser;
    content: string;
    createdAt: Date;
}

export interface ITalkspace {
    id: number;
    name: string;
    url: string;
    OwnerId: number;
}