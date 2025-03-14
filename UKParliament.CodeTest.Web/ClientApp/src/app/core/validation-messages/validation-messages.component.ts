import { CommonModule } from '@angular/common';
import {Component, Input} from '@angular/core';
import {AbstractControl} from "@angular/forms";

@Component({
  selector: 'app-validation-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validation-messages.component.html',
  styleUrl: './validation-messages.component.scss'
})
export class ValidationMessagesComponent {
  @Input() control!: AbstractControl;
  private validationMessages: { [key: string]: string } = {
    required: 'This field is required.',
    minlength: 'The value is too short.',
  };

  listOfErrors(): string[] {
    const errors: string[] = [];
    if (this.control.errors) {
      for (const errorKey in this.control.errors) {
        if (this.control.errors.hasOwnProperty(errorKey)) {
          errors.push(this.validationMessages[errorKey] || 'Invalid field');
        }
      }
    }
    return errors;
  }

  shouldShowErrors(): boolean | null {
    return (
      this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched)
    );
  }

}
