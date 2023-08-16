// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, HttpService, HttpException, HttpStatus } from '@nestjs/common';
// import { Strategy } from 'passport-oauth2';
// import { stringify } from 'querystring';
// import { AuthService } from '..';
// import { UserService } from '../../../user/src/lib/user.service'
// import { UserDTO } from '../../../user/src/lib/user.dto'
// import { lastValueFrom } from 'rxjs';
// import { AxiosResponse } from 'axios';

// @Injectable()
// export class GithubStrategy extends PassportStrategy(Strategy,'github')
// {
//     private axiosResponse$: any
// 	private data: any
// 	constructor(private authService: AuthService,
// 		private http: HttpService, private userService: UserService
// ) {
// 		super({
// 			authorizationURL: `https://github.com/login/oauth/authorize?${ stringify({
// 				client_id    : process.env.GITHUB_CLIENT_ID,
// 				redirect_uri :  process.env.GITHUB_CALLBACK_URL,
// 				response_type: 'code'
// 			}) }`
// ,
// 			tokenURL        : "https://github.com/login/oauth/access_token",
// 			clientID        : process.env.GITHUB_CLIENT_ID,
// 			clientSecret    : process.env.GITHUB_CLIENT_SECRET,
// 			callbackURL     : process.env.GITHUB_CALLBACK_URL,
// 			scope           : null,
// 		});
// 	}

// 	async validate(
// 		accessToken: string,
// 	): Promise<UserDTO> {
//          this.axiosResponse$ = this.http.get('https://api.github.com/user', {
// 				headers: { Authorization: `Bearer ${ accessToken }` },
// 			})
// 		const response: any = await lastValueFrom(this.axiosResponse$);
// 		try
// 		{
// 			return await this.userService.getUser(response.data.id)

// 		}
// 		catch(error)
// 		{
// 			const newUser: UserDTO = {
//                 userId: response.data.id,
//                 name: response.data.name,
//                 username: response.data.username,
//                 email: response.data.email
//             }
//             const {lessons, ...userDTO} = await this.userService.addUser(newUser)
// 			return userDTO;
// 		}
// 	}
// }
