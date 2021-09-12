import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpService } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { stringify } from 'querystring';
import { AuthService } from '..';
import { UserService } from '../../../user/src/lib/user.service'
import { UserDTO } from '../../../user/src/lib/user.dto'


@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github')
{
    private data: any
	constructor(private authService: AuthService,
		private http: HttpService, private userService: UserService
) {
		super({
			authorizationURL: `https://github.com/login/oauth/authorize?${ stringify({
				client_id    : process.env.GITHUB_CLIENT_ID,
				redirect_uri :  process.env.GITHUB_CLIENT_ID,
				response_type: 'code'
			}) }`
,
			tokenURL        : "https://github.com/login/oauth/access_token",
			clientID        : process.env.GITHUB_CLIENT_ID,
			clientSecret    : process.env.GITHUB_CLIENT_SECRET,
			callbackURL     : process.env.GITHUB_CLIENT_ID,
			scope           : null,
		});
	}

	async validate(
		accessToken: string,
	): Promise<UserDTO> {
        await this.http.get('https://api.github.com/user', {
				headers: { Authorization: `Bearer ${ accessToken }` },
			}).subscribe(data => this.data = data);
        const user = await this.userService.getUser(this.data.id)
        if(!user)
        {
            const newUser: UserDTO = {
                userId: this.data.id,
                name: this.data.name,
                username: this.data.username,
                email: this.data.email
            }
            return await this.userService.addUser(newUser)

        }
        else{
            return user
        }


	}
}