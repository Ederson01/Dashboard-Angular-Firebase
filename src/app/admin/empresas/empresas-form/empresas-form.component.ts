import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { tap, finalize, map, startWith } from 'rxjs/operators';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MapsAPILoader, AgmMap } from '@agm/core';

import { SelectImageComponent } from '../../components/select-image/select-image.component';

import { CidadesService } from '../../../services/cidades.service';
import { EmpresaCategoriasService } from '../../../services/empresa-categorias.service';
import { EmpresaTagsService } from '../../../services/empresa-tags.service';
import { EmpresasService } from '../../../services/empresa.service';
import { UploadsService } from '../../../services/uploads.service';

declare var google: any;

@Component({
  selector: 'app-empresas-form',
  templateUrl: './empresas-form.component.html',
  styleUrls: ['./empresas-form.component.scss']
})
export class EmpresasFormComponent {
  empresaForm: FormGroup;
  slug: string = null;
  id: string = null;

  pagante: boolean = false;
  capa: boolean = false;
  propaganda: boolean = false;

  cidadeList: Observable<any[]>;
  categoryList: Observable<any[]>;
  listTags: string[];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredtags: Observable<string[]>;
  tagsCtrl = new FormControl();
  tags: string[] = [];

  lat: number = -22.7535583;
  lng: number = -46.1562415;
  geocoder:any;
  cidade:string;


  @ViewChild('tagsInput') tagsInput: ElementRef<HTMLInputElement>;
  @ViewChild(AgmMap) map: AgmMap;

  constructor(
    private empresasService: EmpresasService,
    private cidadesService: CidadesService,
    private empresaCategoriasService: EmpresaCategoriasService,
    private empresaTagsService: EmpresaTagsService,
    private uploadsService: UploadsService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public mapsApiLoader: MapsAPILoader,
    private route: ActivatedRoute
  ) {
    this.mapsApiLoader = mapsApiLoader;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.cidadeList = this.cidadesService.getData();
    this.categoryList = this.empresaCategoriasService.getData();
    this.empresaTagsService.getDataTitle().subscribe(data => {
      this.listTags = data;
      this.filteredtags = this.tagsCtrl.valueChanges.pipe(startWith(null),
        map((tag: string | null) => tag ? this._filter(tag) : this.listTags.slice()));
    });

    this.empresaForm = this.fb.group({
      title: '',
      slug: '',
      email: '',
      endereco: '',
      numero: '',
      phones: this.fb.array([]),
      cidade: '',
      categorias: '',
      tags: new FormControl(''),
      pagante: false,
      empresaCapa: false,
      propaganda: false,
      posicao: '',
      site: '',
      facebook: '',
      whatsApp: '',
      descricao: '',
      thumbnail: '',
      latitude: '',
      longitude: '',
      gallery: this.fb.array([]),
      bannerSuperior: '',
      bannerLateral: ''
    });

    if(this.id) {
      this.empresasService.getEmpresaID(this.id).subscribe(data => {
        this.populateForm(data);
      });
    } else {
      this.addPhone();
    }
  }

  populateForm = (data) => {
    this.empresaForm.patchValue({
      title: data.title,
      slug: data.slug,
      email: data.email,
      endereco: data.endereco,
      numero: data.numero,
      //phones: data.phones,
      cidade: data.cidade,
      categorias: data.categorias,
      tags: data.tags,
      pagante: data.pagante,
      empresaCapa: data.empresaCapa,
      propaganda: data.propaganda,
      posicao: data.posicao,
      site: data.site,
      facebook: data.facebook,
      whatsApp: data.whatsApp,
      descricao: data.descricao,
      thumbnail: data.thumbnail,
      latitude: data.latitude,
      longitude: data.longitude,
      bannerSuperior: data.bannerSuperior,
      bannerLateral: data.bannerLateral
    });

    this.pagante = data.pagante;
    this.capa = data.empresaCapa;
    this.propaganda = data.propaganda;
    this.tags = data.tags;
    this.lat = data.latitude;
    this.lng = data.longitude;

    for(let numb of data.phones) {
      const phone = this.fb.group({
        numero: [numb.numero],
      })

      this.phoneForms.push(phone);
    }

    this.empresaForm.setControl('gallery', this.fb.array(data.gallery || []));
    this.slug = data.slug;
  }

  slugfy(event: any) {
    this.empresaForm.patchValue({slug:
      event.target.value.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '')            // Trim - from end of text
    });
  }


  verifyEmpresaSlug(contador: number = 0) {
    if((this.empresaForm.get('slug').value) && (this.empresaForm.get('slug').value != this.slug)) {
      this.empresasService.getEmpresa(this.empresaForm.get('slug').value).subscribe(res=>{
        if(res[0]){
          contador++;
          if(this.empresaForm.get('slug').value != null) {
            this.empresaForm.patchValue({slug:this.empresaForm.get('slug').value + "-" + contador});
            this.verifyEmpresaSlug(contador);
          }
        }
      });
    }
  }

  //Numeros
  get phoneForms() {
    return this.empresaForm.get('phones') as FormArray
  }
  addPhone() {
    const phone = this.fb.group({
      numero: [],
    })

    this.phoneForms.push(phone);
  }
  deletePhone(i) {
    this.phoneForms.removeAt(i)
  }

  //Tags
  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) this.tags.push(value.trim());
    if (input) input.value = '';

    this.empresaForm.patchValue({tags: this.tags});
  }
  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) this.tags.splice(index, 1);

    this.empresaForm.patchValue({tags: this.tags});
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagsInput.nativeElement.value = '';

    this.empresaForm.patchValue({tags: this.tags});
  }
  private _filter(value: string) {
    const filterValue = value.toLowerCase();

    return this.listTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }

  //Midia
  selectFile(type: boolean, variable: any, content: any = null) {
    const dialogRef = this.dialog.open(SelectImageComponent, {
      width: '80vw',
      data: {
        type: type,
        content: content
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      switch (variable) {
        case "thumbnail":
          this.empresaForm.patchValue({thumbnail: result});
        break;
        case "gallery":
          this.empresaForm.setControl('gallery', this.fb.array(result || []));
        break;
        case "bannerSuperior":
          this.empresaForm.patchValue({bannerSuperior: result});
        break;
        case "bannerLateral":
          this.empresaForm.patchValue({bannerLateral: result});
        break;
      }
    })
  }
  deleteMidia(index: number) {
    const formImages = this.empresaForm.get('gallery') as FormArray;
    formImages.removeAt(index);
  }
  deletePropaganda(banner: string) {
    if(banner == "bannerSuperior") {
      this.empresaForm.patchValue({bannerSuperior: ''});
    } else if(banner == "bannerLateral") {
      this.empresaForm.patchValue({bannerLateral: ''});
    }
  }


  //Map
  setCity(cidade: string) {
    this.cidade = cidade;
  }

  markerDragEnd(m: any, $event: any) {
   this.lat = m.coords.lat;
   this.lng = m.coords.lng;
   this.empresaForm.patchValue({latitude: m.coords.lat});
   this.empresaForm.patchValue({longitude: m.coords.lng});
  }

  findLocation() {
    let address = this.empresaForm.get('endereco').value + " " + this.empresaForm.get('numero').value + " " + this.cidade + " MG Brasil";
    if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
    this.geocoder.geocode({
      'address': address
    }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0].geometry.location) {
          this.lat = results[0].geometry.location.lat();
          this.lng = results[0].geometry.location.lng();
          this.empresaForm.patchValue({latitude: results[0].geometry.location.lat()});
          this.empresaForm.patchValue({longitude: results[0].geometry.location.lng()});
        }

        this.map.triggerResize()
      } else {
        console.log("Sorry, this search produced no results.");
      }
    })
  }

  salvar() {
    if(!this.id) {
      this.empresasService.salvarEmpresa(this.empresaForm);
    } else {
      this.empresasService.updateEmpresa(this.empresaForm, this.id);
    }
  }
}
