import { ActivityType, PresenceUpdateStatus } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
import { config } from "../../config/config";


export default class Ready extends Event {
  constructor(client: BotClient, file: string) {
    super(client, file, {
      name: "ready",
    });
  }

  async callback() {
    this.client.logger.success(`${this.client.user?.tag} is ready!`);
    
    // Change presence fuctions
    this.presence1();
    setInterval(() => {
        this.presence1();
        setInterval(() =>{
            this.presence2();
        }, 5 * 1000);
    }, 5 * 1000);
  }

  async presence1(){
    try {
      this.client.user?.setPresence({
          activities: [{
              name: `/help | ${this.client.guilds.cache.size} เซิฟเวอร์`,
              type: ActivityType.Streaming,
              url: "https://www.twitch.tv/im_just_non",
          }],
          status: PresenceUpdateStatus.Online,
      });
    } catch (e) {
      this.client.user?.setPresence({
          activities: [{
              name: `/help | ${this.client.guilds.cache.size} เซิฟเวอร์`,
              type: ActivityType.Streaming,
              url: "https://www.twitch.tv/im_just_non",
          }],
          status: PresenceUpdateStatus.Online,
      });
    }
  }

  async presence2(){
    try {
      this.client.user?.setPresence({
          activities: [{
              name: `V.2.4.0 | Coming Soon...`,
              type: ActivityType.Streaming,
              url: "https://www.twitch.tv/im_just_non",
          }],
          status: PresenceUpdateStatus.Online
      });
    } catch (e) {
        this.client.user?.setPresence({
            activities: [{
                name: `V.2.4.0 | Coming Soon...`,
                type: ActivityType.Streaming,
                url: "https://www.twitch.tv/im_just_non",
            }],
            status: PresenceUpdateStatus.Online
        });
    }
  }
};
