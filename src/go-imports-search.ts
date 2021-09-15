import { EMPTY, from, of } from 'rxjs'
import { concatMap, toArray } from 'rxjs/operators'
import * as sourcegraph from 'sourcegraph'
import { resolveSettings, Settings } from './settings'

const goImportsDecorationType = sourcegraph.app.createDecorationType()

export function activate(): void {
    const settings = resolveSettings(sourcegraph.configuration.get<Settings>().value)

    sourcegraph.search.registerQueryTransformer({
        transformQuery: (query: string) => {
            const goImportsRegex = /\bgo.imports:([^\s]*)/
            if (query.match(goImportsRegex)) {
                // Get package name
                const pkgFilter = query.match(goImportsRegex)
                const pkg = pkgFilter && pkgFilter.length >= 1 ? pkgFilter[1] : ''

                // Package imported in grouped import statements
                const matchPackage = '^\\t"[^\\s]*' + pkg + '[^\\s]*"$'
                // Match packages with aliases
                const matchAlias = '\\t[\\w/]*\\s"[^\\s]*' + pkg + '[^\\s]*"$'
                // Match packages in single import statement
                const matchSingle = 'import\\s"[^\\s]*' + pkg + '[^\\s]*"$'
                const finalRegex = `(${matchPackage}|${matchAlias}|${matchSingle}) lang:go `

                return query.replace(goImportsRegex, finalRegex)
            }
            return query
        },
    })

    sourcegraph.workspace.openedTextDocuments.subscribe(doc => {
        if (!settings['goImports.showAllUsagesLinks']) {
            return
        }

        if (doc.languageId !== 'go' || !doc.text) {
            return
        }
        from(doc.text.split('\n'))
            .pipe(
                concatMap((line, lineNumber) => {
                    // An issue with the second regex is that it'll match lines like
                    //  return "string"
                    const goPkgRegex = /\t\"([^\s]*)\"$|\t([^\s]*)\s"[^\s]*"$|import\s"([^\s]*)"$/
                    const match = goPkgRegex.exec(line)
                    if (match && match.length > 1) {
                        // The match index depends on which regex pattern actually produced a match
                        const pkgName = match[1] ? match[1] : match[2] ? match[2] : match[3]
                        return of({ lineNumber, pkgName })
                    }
                    return EMPTY
                }),
                toArray()
            )
            .subscribe(matches => {
                if (!matches || sourcegraph.app.activeWindow?.activeViewComponent?.type !== 'CodeEditor') {
                    return
                }

                sourcegraph.app.activeWindow.activeViewComponent.setDecorations(
                    goImportsDecorationType,
                    matches.map(match => ({
                        range: new sourcegraph.Range(
                            new sourcegraph.Position(match.lineNumber, 0),
                            new sourcegraph.Position(match.lineNumber, 0)
                        ),
                        after: {
                            contentText: 'See all usages',
                            linkURL: '/search?q=go.imports:' + match.pkgName,
                            backgroundColor: 'pink',
                            color: 'black',
                        },
                    }))
                )
            })
    })
}

// See https://about.sourcegraph.com/blog/extension-authoring for instructions and examples.
