import { html, TemplateResult } from 'lit';
import { Button } from '../../general/Popup';
import { Styles } from '../../forms/Button';

export function cell_button(value: Button): TemplateResult {
    return html`
        <style>
            .base {
                height: 100%;
                width: 100%;
                align-content: center;
                justify-content: center;
                text-align: center;
                border-radius: 10px;
                color: white;
            }
            .true {
                background-color: #007604;
            }
            .false {
                background-color: #c30000;
            }
        </style>
        <md-button icon=${value.icon}  .type=${Styles[value.type]} .disabled=${value.disabled}>${value.title}</md-button>
      `;
}