import request from 'superagent'
import { EventEmitter } from 'events'

export default class SlackData extends EventEmitter {

  constructor ({ token, interval, org: host }){
    super()
    this.host = host
    this.token = token
    // this.interval = interval
    this.ready = false
    this.org = {}
    this.channelsByName = {}
    this.init()
    // this.fetch()
  }

  init (){
    request
    .get(`https://${this.host}.slack.com/api/channels.list`)
    .query({ token: this.token })
    .end((err, res) => {
      if (err) {
        throw err;
      }
      (res.body.channels || []).forEach(channel => {
        this.channelsByName[channel.name] = channel
      })
    })

    request
    .get(`https://${this.host}.slack.com/api/team.info`)
    .query({ token: this.token })
    .end((err, res) => {
      let team = res.body.team
      if (!team) {
        throw new Error('Bad Slack response. Make sure the team name and API keys are correct');
      }
      this.org.name = team.name
      if (!team.icon.image_default) {
        this.org.logo = team.icon.image_132
      }
    })

    this.ready = true
    this.emit('ready')
  }


  getChannelId (name){
    let channel = this.channelsByName[name]
    return channel ? channel.id: null
  }

}
