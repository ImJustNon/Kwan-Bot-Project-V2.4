import { ActivityType, PresenceUpdateStatus } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
import { config } from "../../config/config";


export default class Ready extends Event {
	constructor(client: BotClient, file: string) {
		super(client, file, {
			name: "ready",
			type: "client"
		});
	}

	async callback() {
		this.client.logger.info(`${this.client.user?.tag} is ready!`);

		await this.changePresence();
	}


	async changePresence(){
		let index: number = 0;

		setInterval(async() => {
			if(index >= config.bot.presences.length) index = 0;
			await this.setPresence(index);
			index++;
		}, 5000);
	}

	async setPresence(index: number) {
		try {
			this.client.user?.setPresence({
				activities: [{
					...config.bot.presences[index],
					name: (config.bot.presences[index].name).replace("%guild_size%", String(this.client.guilds.cache.size)),
				}],
				status: PresenceUpdateStatus.Online,
			});
		} catch (e) {
			this.client.user?.setPresence({
				activities: [{
					...config.bot.presences[index],
					name: (config.bot.presences[index].name).replace("%guild_size%", String(this.client.guilds.cache.size)),
				}],
				status: PresenceUpdateStatus.Online,
			});
		}
	}


};
