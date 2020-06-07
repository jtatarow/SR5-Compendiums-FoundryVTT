import { DataImporter } from "./DataImporter";
import {ImportHelper} from "./ImportHelper";
import {Constants} from "./Constants";
import Armor = Shadowrun.Armor;

export class ArmorImporter extends DataImporter {
    CanParse(jsonObject: object): boolean {
        return jsonObject.hasOwnProperty("armors") && jsonObject["armors"].hasOwnProperty("armor");
    }

    GetDefaultData(): Armor {
        return {
            name: "Unnamed Armor",
            folder: null,
            type: "armor",
            data: {
                description: {
                    value: "",
                    chat: "",
                    source: ""
                },
                technology: {
                    rating: 1,
                    availability: "",
                    quantity: 1,
                    cost: 0,
                    equipped: true,
                    conceal: {
                        base: 0,
                        value: 0,
                        mod: {}
                    }
                },
                condition_monitor: {
                    value: 0,
                    max: 0
                },
                armor: {
                    value: 0,
                    mod: false,
                    acid: 0,
                    cold: 0,
                    fire: 0,
                    electricity: 0,
                    radiation: 0
                }
            },
            permission: {
                default: 2
            }
        };
    }

    ParseData(jsonObject: object) {
        let data = this.GetDefaultData();
        data.name = ImportHelper.stringValue(jsonObject, "name");
        data.data.description.source = `${ImportHelper.stringValue(jsonObject, "source")} ${ImportHelper.stringValue(jsonObject, "page")}`;

        data.data.technology.availability = ImportHelper.stringValue(jsonObject, "avail");
        data.data.technology.cost = ImportHelper.intValue(jsonObject, "cost");

        data.data.armor.value = ImportHelper.intValue(jsonObject, "armor", 0);
        data.data.armor.mod = ImportHelper.stringValue(jsonObject, "armor").includes("+");
        return data;
    }

    async Parse(jsonObject: object): Promise<Entity> {
        const folders = await ImportHelper.MakeCategoryFolders(jsonObject, "Armor");

        let datas: Armor[] = [];
        let jsonDatas = jsonObject["armors"]["armor"];
        for (let i = 0; i < jsonDatas.length; i++) {
            let jsonData = jsonDatas[i];
            let data = this.ParseData(jsonData);

            let category = ImportHelper.stringValue(jsonData, "category");
            let folder = folders[category];

            if (game.items.find((item) => item.folder === folder.id && item.name === data.name)) {
                continue;
            }

            data.folder = folder.id;

            datas.push(data);
        }

        return await Item.create(datas);
    }
}