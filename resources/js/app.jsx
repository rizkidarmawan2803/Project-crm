import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

createInertiaApp({
    // mempertahankan struktur title lama
    // hanya menambahkan branding Disty CRM
    title: (title) => `${title} - Disty CRM`,

    // mempertahankan resolve asli
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),

    // mempertahankan struktur setup lama
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },

    // tambahan dari file baru
    // progress loading inertia
    progress: {
        color: "#1a56db",
    },
});
