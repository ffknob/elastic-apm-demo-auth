import { User, SignInProvider } from '@ffknob/elastic-apm-demo-shared';

const users: User[] = [];

export class DataService {
    static findUserById(id: string): User | undefined {
        return users.find((u: User) => u._id === id);
    }

    static findProviderUser(
        id: string,
        provider: SignInProvider
    ): User | undefined {
        return users.find((u: User) =>
            u[provider as string] ? u[provider as string].id === id : false
        );
    }

    static findLocalUser(email: string, password: string): User | undefined {
        return users.find(
            (u: User) => email === u.email && password === u.password
        );
    }

    static addUser(user: User): User {
        if (user._id) {
            const existingUser: User | undefined = this.findUserById(user._id);

            if (existingUser) {
                throw new Error(`User with id ${user._id} already exists.`);
            }
        }

        users.push(user);

        return user;
    }
}
