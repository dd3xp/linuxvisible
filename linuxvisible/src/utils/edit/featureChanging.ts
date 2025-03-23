/*
保存修改特性接受参数：
一个Entities，一个nameEn，一个nameCn，
一个x1，一个y1，一个x2，一个y2，一个parentEid，一个level固定为3，
一个更新时间。一个存储log的列表.
逻辑:先根据正在修改的特性的eid找到该特性,将参数与现有的特性的eid,nameEn,nameCn,x1,y1,x2,y2,parentEid进行比较,
如果相同则不进行修改,如果不同则进行修改,并将updatetime修改为参数中的更新时间.
最后修改了的内容作为log保存到存储log的列表中,格式为更新时间:修改内容.(这个修改内容不包括更新时间)
修改一次保存一个表项.

保存新增特性接受参数：
一个Entities，一个nameEn，一个nameCn，
一个x1，一个y1，一个x2，一个y2，一个parentEid，一个level固定为3，
一个创建时间，一个更新时间。
逻辑:根据数据创造一个特性实体
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

*/









