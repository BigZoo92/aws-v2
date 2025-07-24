export async function fetchStats() {
  try {
    const baseUrl = import.meta.env.VITE_API_URL;

    const [usersRes, productsRes] = await Promise.all([
      fetch(`${baseUrl}/stats/users`, { credentials: 'include' }),
      fetch(`${baseUrl}/stats/products`, { credentials: 'include' }),
    ]);

    if (!usersRes.ok || !productsRes.ok) {
      const usersErr = await usersRes.json().catch(() => ({}));
      const productsErr = await productsRes.json().catch(() => ({}));

      return {
        success: false,
        message:
          usersErr.error || productsErr.error || 'Erreur lors de la récupération des statistiques',
      };
    }

    const usersData = await usersRes.json();
    const productsData = await productsRes.json();

    return {
      success: true,
      totalUsers: usersData.totalUsers,
      totalProducts: productsData.totalProducts,
    };
  } catch (error) {
    console.error('Erreur fetchStats:', error);
    return {
      success: false,
      message: 'Erreur réseau lors de la récupération des statistiques',
    };
  }
}
