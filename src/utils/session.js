// Fuente única de verdad para la sesión actual.
// El login de Supabase guarda `currentUser`; el modelo viejo guardaba `users`.
// Este helper acepta ambos para no romper sesiones existentes.
export const getSessionUser = () => {
  try {
    const current = JSON.parse(localStorage.getItem("currentUser"));
    if (current && typeof current === "object" && !Array.isArray(current)) {
      return current;
    }
  } catch {
    /* localStorage corrupto: se ignora */
  }

  try {
    const users = JSON.parse(localStorage.getItem("users"));
    if (users && typeof users === "object" && !Array.isArray(users)) return users;
    if (Array.isArray(users) && users.length > 0) return users[0];
  } catch {
    /* localStorage corrupto: se ignora */
  }

  return null;
};

export const isLoggedIn = () => getSessionUser() !== null;
