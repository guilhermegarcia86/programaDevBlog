import React from "react"

import * as Style from "./styles"

const TableContent = ({listElements}) => {

    debugger

    return(
        <Style.TableWrapper>
            <Style.Content>
            {Array.from(listElements).map((h2, index) => {
                return (<Style.Items key={h2.attributes[0].value+index}>
                    <Style.LinkItem
                        href={h2.lastChild.attributes[0].value}>
                            {h2.firstChild.data.replace(' permalink', '')}
                    </Style.LinkItem>    
                </Style.Items>)
            })}
            </Style.Content>
        </Style.TableWrapper>
    )
}

export default TableContent