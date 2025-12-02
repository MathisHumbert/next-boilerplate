import { singletonDocumentListItem } from "sanity-plugin-singleton-tools";
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S, context) => {
  return (
    S.list()
      .title("Boilerplate")
      // singleton
      .items([
        singletonDocumentListItem({
          S,
          context,
          type: "home",
          title: "Home",
          id: "home",
        }),
        singletonDocumentListItem({
          S,
          context,
          type: "about",
          title: "About",
          id: "about",
        }),
        S.divider(),
        // repeatables

        // settings
        singletonDocumentListItem({
          S,
          context,
          type: "settings",
          title: "Settings",
          id: "settings",
        }),
      ])
  );
};
