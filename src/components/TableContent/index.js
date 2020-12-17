import React from "react"
import PropTypes from "prop-types"

import * as Style from "./styles"

const TableContent = ({listLinks}) => {

    return(
        <Style.TableWrapper>
            <Style.Content>
            {listLinks.filter(link => link.ariaLabel != null).map((link, index) => {
                return (<Style.Items key={link.href+index}>
                    <Style.LinkItem
                        href={link.href}>
                            {link.ariaLabel.replace(' permalink', '')}
                    </Style.LinkItem>    
                </Style.Items>)
            })}
            </Style.Content>
        </Style.TableWrapper>
    )

}

TableContent.propTypes = {
    html: PropTypes.array
}

export default TableContent