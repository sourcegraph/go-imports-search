export interface Settings {
    ['goImports.showAllUsagesLinks']: boolean
}

export function resolveSettings(raw: Partial<Settings>): Settings {
    return {
        ['goImports.showAllUsagesLinks']: !!raw['goImports.showAllUsagesLinks'],
    }
}
