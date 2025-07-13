import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../backend.service';

@Component({
  standalone: true,
  selector: 'app-registro-dialog',
  templateUrl: './registro-dialog.component.html',
  styleUrls: ['./registro-dialog.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class RegistroDialogComponent implements OnInit {
  form!: FormGroup;
  gradosPrimaria = ['1º', '2º', '3º', '4º', '5º', '6º', '7º', '8º', '9º', '10º', '11º'];
  boletines!: FormArray;
  esPrimaria = false;
  dialogRef: any;

  constructor(private fb: FormBuilder,
       private backendService: BackendService,
  ) {}

  ngOnInit(): void {
this.form = this.fb.group({
  grado: ['Transición', Validators.required],
  subGrado: [''],
  estudiante: this.fb.group({ 
    nombre: ['', Validators.required],
    cedula: ['', Validators.required],
    fechaNacimiento: ['', Validators.required],
    registroCivil: [null, Validators.required],
    eps: [''],
    sisben: [''],
    carnet_vacunas: [null, Validators.required],
    fotografia: [null, Validators.required],
  }),
  acudiente: this.fb.group({
    nombre: ['', Validators.required],
    cedula: ['', Validators.required],
    contacto1: ['', Validators.required],
    contacto2: ['', Validators.required],
    documento_acudiente: [null, Validators.required] 
  }),
  boletines: this.fb.array([])
});


    this.boletines = this.fb.array([]);

    this.form.get('grado')?.valueChanges.subscribe(valor => {
      this.esPrimaria = valor === 'Primaria';
      if (!this.esPrimaria) {
        this.boletines.clear();
      }
    });

    this.form.get('subGrado')?.valueChanges.subscribe(grado => {
      this.actualizarBoletines(grado);
    });
  }

  actualizarBoletines(gradoSeleccionado: string): void {
    this.boletines.clear();
    const grados = ['1º', '2º', '3º', '4º', '5º', '6º', '7º', '8º', '9º', '10º', '11º'];
    const index = grados.indexOf(gradoSeleccionado);

    if (index > -1) {
      if (index <= 4) {
        // Solo un boletín si es de 1º a 5º
        this.boletines.push(this.fb.control(null, Validators.required));
      } else {
        // Boletines desde 5º hasta el grado anterior
        for (let i = 4; i < index; i++) {
          this.boletines.push(this.fb.control(null, Validators.required));
        }
      }
    }
  }
onArchivoSeleccionado(event: Event, campo: string) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    // Verifica si el campo está dentro del grupo estudiante
    const estudiante = this.form.get('estudiante') as FormGroup;
    if (estudiante.controls[campo]) {
      estudiante.get(campo)?.setValue(file);
      return;
    }

    // Verifica si el campo está dentro del grupo acudiente
    const acudiente = this.form.get('acudiente') as FormGroup;
    if (acudiente.controls[campo]) {
      acudiente.get(campo)?.setValue(file);
      return;
    }

    // Si no se encuentra el campo, puedes registrar un error opcionalmente
    console.warn(`Campo ${campo} no encontrado en el formulario`);
  }
}

  onFileChange(event: any, index?: number) {
    const file = event.target.files[0];
    if (file && file.type !== 'application/pdf') {
      alert('Solo se permiten archivos en formato PDF.');
      return;
    }

    if (typeof index === 'number') {
      this.boletines.at(index).setValue(file);
    } else {
      // para los campos como registroCivil, vacunas, fotografia
      const controlName = event.target.getAttribute('formcontrolname');
      const estudiante = this.form.get('estudiante') as FormGroup;
      if (estudiante.controls[controlName]) {
        estudiante.controls[controlName].setValue(file);
      }
    }
  }

guardarFormulario() {
  // if (this.form.invalid) {
  //   alert('Por favor complete todos los campos requeridos.');
  //   return;
  // }

  const datos = {
    ...this.form.value,
    boletines: this.boletines.value, // asegúrate que este sea un array de archivos
  };

  console.log("Datos a enviar:", datos);

  this.backendService.registrarInscripcion(datos).then(() => {
    alert('Formulario enviado exitosamente');
  }).catch(error => {
    alert('Ocurrió un error al enviar el formulario');
    console.error(error);
  });
}

}
