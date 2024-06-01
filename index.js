exports.NetworkMod = function reee(d) {
    d.dispatch.addDefinition('C_MATCH_ADD', 0, __dirname + '/C_MATCH_ADD.def', true)
    d.dispatch.addOpcode('C_MATCH_ADD', 52831)

    let stance = false, queueEvent = null

    d.hook('S_RP_SKILL_POLISHING_LIST', '*', (e) => {
        let found = false
        e.optionEffects.forEach(arg => {
            if (!arg.active) return
            if ([17111802, 17012001, 17042101].includes(arg.id)) found = true
        })
        stance = found
    })

    d.hook('C_MATCH_ADD', 0, (e) => {
        if (!['berserker', 'fighter', 'warrior'].includes(d.game.me.class)) return
        e.players.forEach(arg => {
            if (arg.id == d.game.me.playerId) arg.role = stance ? 0 : 1
        })
        queueEvent = e
        if (e.instances[0].type !== 0) return//avoid this actually modifying bgs while retaining req for bgs
        return true
    })

    d.command.add('req', () => {
        if (queueEvent) d.send('C_MATCH_ADD', 0, queueEvent)
        else d.command.message('no queue data found')
    })

    d.game.on('enter_game', () => { stance = false; queueEvent = null })
}