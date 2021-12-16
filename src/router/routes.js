import details from '/src/components/details.vue'
import tableau from '/src/components/tableau.vue'
import tableau_admin from '/src/components/tableau_admin'
import caddy from '/src/components/caddy.vue'

export default [
    {
        path: '/', name: tableau, component: tableau
    },
    {
        path: '/a/:isAdmin', name: tableau, component: tableau_admin
    },
    {
        path: '/d/:id', name: details, component: details
    },
    {
        path: '/c',  component: caddy,
    },

]