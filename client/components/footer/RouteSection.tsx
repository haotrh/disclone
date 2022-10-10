import React from "react";

interface SectionLink {
  name: string;
  path?: string;
}

export interface RouteSectionProps {
  sectionName: string;
  sectionLinks: SectionLink[];
}

const RouteSection: React.FC<RouteSectionProps> = ({
  sectionName,
  sectionLinks,
}) => {
  return (
    <ul className="lg:flex-1 space-y-3 w-[calc(50%-8px)] mb-4">
      <li className="text-indigo-500">{sectionName}</li>
      {sectionLinks.map((sectionLink) => (
        <li key={sectionLink.name}>
          <a href={sectionLink.path}>{sectionLink.name}</a>
        </li>
      ))}
    </ul>
  );
};

export default RouteSection;
