export type DemoRole = 'player' | 'staff'

const key = 'picklerverse-demo-role-v1'

export function getDemoRole(): DemoRole | null {
  try {
    const value = sessionStorage.getItem(key)
    return value === 'player' || value === 'staff' ? value : null
  } catch {
    return null
  }
}

export function setDemoRole(role: DemoRole) {
  try { sessionStorage.setItem(key, role) } catch {}
  window.dispatchEvent(new CustomEvent('picklerverse-role-change', { detail: role }))
}

export function clearDemoRole() {
  try { sessionStorage.removeItem(key) } catch {}
  window.dispatchEvent(new CustomEvent('picklerverse-role-change', { detail: null }))
}
