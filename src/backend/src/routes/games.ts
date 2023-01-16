import type { Route } from '#util/http';
import type { Request, Response } from 'polka';
import { inject, injectable } from 'tsyringe';
import type { Game } from '#util/structures';

@injectable()
export default class GamesRoute implements Route {
    public constructor(@inject('gameData') private readonly gameData: Game[]) {}

	public get(_: Request, res: Response) {
        const payload = this.gameData.map(data => data.toJSON());

		return res.send(200, payload);
	}
}