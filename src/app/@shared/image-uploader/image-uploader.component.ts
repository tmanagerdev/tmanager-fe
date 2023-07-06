import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { convertToBase64 } from 'src/app/@core/utils';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss'],
})
export class ImageUploaderComponent {
  @Input() control?: any;
  @ViewChild('fileUploader', { static: false })
  uploader?: ElementRef<HTMLElement>;

  constructor() {}

  ngOnInit(): void {}

  async onChange(event: any) {
    if (
      event &&
      event.target &&
      event.target.files &&
      event.target.files.length
    ) {
      const fileBase64 = await convertToBase64(event.target.files[0]);
      this.control?.setValue(fileBase64);
    }
  }

  onTriggerUpload(): void {
    this.uploader?.nativeElement.click();
  }

  getBg() {
    const expression =
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    return !!this.control?.value
      ? regex.test(this.control?.value)
        ? this.control.value
        : this.control.value
      : '/assets/images/placeholder.png';
  }

  onRemoveImage(event: any) {
    event.stopPropagation();
    this.control?.setValue(null);
  }
}
