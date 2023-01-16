export class Country {
    public name: string;
    public games: Game[];

    public constructor(name: string, games: Game[]) {
        this.setName(name);
        this.setGames(games);
    }

    public setName(name: string) {
        this.name = name;
    }

    public setGames(games: Game[]) {
        this.games = games;
    }

    public toJSON() {
        return {
            name: this.name,
            games: this.games.map(game => game.toJSON())
        };
    }
}

export class Game {
    public id: string;
    public city: string;
    public state: string;
    public venue: string;
    public teams: string[];
    public price: number;
    public country: string;

    public constructor(city: string, state: string, venue: string, teams: string[], price: string, country: string) {
        this.setID(city);
        this.setCity(city);
        this.setState(state);
        this.setVenue(venue);
        this.setTeams(teams);
        this.setPrice(price);
        this.setCountry(country);
    }

    public setID(city: string) {
        this.id = city.split(" ").join('-').toLowerCase();
    }

    public setCity(city: string) {
        this.city = city;
    }

    public setState(state: string) {
        this.state = state;
    }

    public setVenue(venue: string) {
        this.venue = venue;
    }

    public setTeams(teams: string[]) {
        this.teams = teams;
    }

    public setPrice(price: string) {
        this.price = Number.parseInt(price);
    }

    public setCountry(country: string) {
        this.country = country;
    }

    public toJSON() {
        return {
            id: this.id,
            city: this.city,
            state: this.state,
            venue: this.venue,
            teams: this.teams,
            price: this.price,
            country: this.country
        };
    }
}