import styled from 'styled-components'

export const Details = styled.ul`
    position: absolute;
    top: 0;
    bottom: 0;
    left: -100%;
    margin: auto;
    padding: 0;
    list-style: none;
    transition: left 0.2s;
    background: rgba(0, 0, 0, .6);
    color: #fff;
    padding: 10px;
    width: 100%;
    font-size: 0.9rem;

    &:hover {
        left: 0%;
    }


`

export const Item = styled.li`
    display: inline-block;

`