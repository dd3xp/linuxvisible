export interface EntityNode {
    eid: number;
    nameEn: string;
    nameCn: string | null;
    source: string | null;
    definitionEn: string | null;
    definitionCn: string | null;
    aliases: string | null;
    relDesc: string | null;
    wikidataId: string | null;
    createTime: string;
    updateTime: string;
    level: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    belongTo: number;
  }
  