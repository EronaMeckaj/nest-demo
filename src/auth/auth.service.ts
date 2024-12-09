import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UsersService,
    ) { }

    async validateUser({ username, password }: AuthPayloadDto) {
        const user = await this.userService.findUserByUsername(username);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        if (!user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const tokenPayload = {
            id: user.id,
            username: user.username,
        };
        const token = this.jwtService.sign(tokenPayload);
        return { token };
    }

    async signup(userDetails: AuthPayloadDto) {
        const newUser = await this.userService.createUser(userDetails);
        const { password: _, ...userWithoutPassword } = newUser;
        const token = this.jwtService.sign(userWithoutPassword);
        return { token };
    }

}
