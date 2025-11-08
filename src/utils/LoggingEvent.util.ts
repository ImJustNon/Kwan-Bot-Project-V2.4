export const LoggingCategory = [
    {
        name: "message",
        description: "เหตุการณ์ที่เกี่ยวกับข้อความในเซิร์ฟเวอร์",
    },
    {
        name: "member",
        description: "เหตุการณ์ที่เกี่ยวกับสมาชิกในเซิร์ฟเวอร์",
    },
    {
        name: "guild",
        description: "เหตุการณ์ที่เกี่ยวกับเซิร์ฟเวอร์",
    },
    {
        name: "role",
        description: "เหตุการณ์ที่เกี่ยวกับบทบาทในเซิร์ฟเวอร์",
    },
    {
        name: "channel",
        description: "เหตุการณ์ที่เกี่ยวกับช่องในเซิร์ฟเวอร์",
    },
    {
        name: "ban",
        description: "เหตุการณ์ที่เกี่ยวกับการแบนสมาชิกในเซิร์ฟเวอร์",
    },
    {
        name: "invite",
        description: "เหตุการณ์ที่เกี่ยวกับลิงก์เชิญในเซิร์ฟเวอร์",
    }
];

export const LoggingEvent = [
    {
        event: "messageCreate",
        description: "เมื่อมีการส่งข้อความใหม่ในเซิร์ฟเวอร์",
        category: "message"
    },
    {
        event: "messageDelete",
        description: "เมื่อมีการลบข้อความในเซิร์ฟเวอร์",
        category: "message"
    },
    {
        event: "messageUpdate",
        description: "เมื่อมีการแก้ไขข้อความในเซิร์ฟเวอร์",
        category: "message"
    },
    {
        event: "messageBulkDelete",
        description: "เมื่อมีการลบข้อความหลายข้อความในเซิร์ฟเวอร์",
        category: "message"
    },
    {
        event: "guildMemberAdd",
        description: "เมื่อมีสมาชิกใหม่เข้าร่วมเซิร์ฟเวอร์",
        category: "member"
    },
    {
        event: "guildMemberRemove",
        description: "เมื่อมีสมาชิกออกจากเซิร์ฟเวอร์",
        category: "member"
    },
    {
        event: "guildMemberUpdate",
        description: "เมื่อมีการอัปเดตข้อมูลสมาชิกในเซิร์ฟเวอร์",
        category: "member"
    },
    {
        event: "userUpdate",
        description: "เมื่อมีการอัปเดตข้อมูลผู้ใช้",
        category: "member"
    },
    {
        event: "guildUpdate",
        description: "เมื่อมีการอัปเดตข้อมูลเซิร์ฟเวอร์",
        category: "guild"
    },
    {
        event: "roleCreate",
        description: "เมื่อมีการสร้างบทบาทใหม่ในเซิร์ฟเวอร์",
        category: "role"
    },
    {
        event: "roleDelete",
        description: "เมื่อมีการลบบทบาทในเซิร์ฟเวอร์",
        category: "role"
    },
    {
        event: "roleUpdate",
        description: "เมื่อมีการอัปเดตบทบาทในเซิร์ฟเวอร์",
        category: "role"
    },
    {
        event: "channelCreate",
        description: "เมื่อมีการสร้างช่องใหม่ในเซิร์ฟเวอร์",
        category: "channel"
    },
    {
        event: "channelDelete",
        description: "เมื่อมีการลบช่องในเซิร์ฟเวอร์",
        category: "channel"
    },
    {
        event: "channelUpdate",
        description: "เมื่อมีการอัปเดตช่องในเซิร์ฟเวอร์",
        category: "channel"
    },
    {
        event: "voiceStateUpdate",
        description: "เมื่อมีการอัปเดตสถานะเสียงในเซิร์ฟเวอร์",
        category: "channel"
    },
    {
        event: "guildBanAdd",
        description: "เมื่อมีการแบนสมาชิกในเซิร์ฟเวอร์",
        category: "ban"
    },
    {
        event: "guildBanRemove",
        description: "เมื่อมีการยกเลิกแบนสมาชิกในเซิร์ฟเวอร์",
        category: "ban"
    },
    {
        event: "inviteCreate",
        description: "เมื่อมีการสร้างลิงก์เชิญใหม่ในเซิร์ฟเวอร์",
        category: "invite"
    },
    {
        event: "inviteDelete",
        description: "เมื่อมีการลบลิงก์เชิญในเซิร์ฟเวอร์",
        category: "invite"
    },
    {
        event: "messageReactionAdd",
        description: "เมื่อมีการเพิ่มปฏิกิริยาต่อข้อความในเซิร์ฟเวอร์",
        category: "message"
    },
    {
        event: "messageReactionRemove",
        description: "เมื่อมีการลบปฏิกิริยาต่อข้อความในเซิร์ฟเวอร์",
        category: "message"
    },
    {
        event: "messageReactionRemoveAll",
        description: "เมื่อมีการลบปฏิกิริยาทั้งหมดต่อข้อความในเซิร์ฟเวอร์",
        category: "message"
    }
];