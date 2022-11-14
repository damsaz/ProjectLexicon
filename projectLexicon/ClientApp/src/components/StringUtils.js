

export function getUserName(user) {
    if (!user) return "Unknown"
    const name = `${user.firstName} ${user.lastName}`
    if (name && name.trim()) return name
    if (user.email && user.email.trim()) return user.email
    return "Unknown"
}


