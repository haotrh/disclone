import Divider from "@app/common/Divider";
import { Label } from "@app/common/input";
import PermissionWrapper from "@app/common/PermissionWrapper";
import _ from "lodash";
import React, { ReactNode, useState } from "react";
import { Permissions } from "types/permissions";
import LayerModalSidebar from "./LayerModalSidebar";
import LayerModalTab from "./LayerModalTab";
import { LayerModalTabProvider } from "./LayerModalTabContext";

interface SideViewCategory {
  categoryName?: ReactNode;
  tabs: {
    name: ReactNode;
    content?: ReactNode;
    custom?: boolean;
    permissions?: Permissions;
  }[];
}

interface LayerModalSideViewProps {
  categories: SideViewCategory[];
}

const LayerModalSideView: React.FC<LayerModalSideViewProps> = ({ categories }) => {
  const [selectedTab, setSelectedTab] = useState([0, 0]);

  const onClick = (index: [number, number], content?: ReactNode) => {
    if (content) {
      setSelectedTab(index);
    }
  };

  return (
    <LayerModalTabProvider setTab={setSelectedTab}>
      <LayerModalSidebar>
        <div className="mx-2">
          {categories.map((category, categoryIndex) => (
            <React.Fragment key={categoryIndex}>
              {categoryIndex !== 0 && <Divider />}
              <div className="mt-2">
                {category.categoryName && (
                  <div>
                    <Label className="text-text-muted font-bold">{category.categoryName}</Label>
                  </div>
                )}
                {category.tabs.map((tab, tabIndex) => (
                  <PermissionWrapper permissions={tab.permissions} key={`${(tab.name, tabIndex)}`}>
                    {tab.custom ? (
                      tab.name
                    ) : (
                      <div>
                        <LayerModalTab
                          onClick={() => onClick([categoryIndex, tabIndex], tab.content)}
                          selected={_.isEqual([categoryIndex, tabIndex], selectedTab)}
                        >
                          {tab.name}
                        </LayerModalTab>
                      </div>
                    )}
                  </PermissionWrapper>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </LayerModalSidebar>
      <div className="flex-grow flex-shrink basis-[800px] bg-background-primary h-full pr-1">
        {categories[selectedTab[0]].tabs[selectedTab[1]].content}
      </div>
    </LayerModalTabProvider>
  );
};

export default LayerModalSideView;
