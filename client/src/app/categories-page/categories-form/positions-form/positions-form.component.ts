import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../shared/services/positions.service";
import {Position} from "../../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../../shared/classes/material.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('CategoryId') categoryId: string
  @ViewChild('modal') modalRef: ElementRef
  form: FormGroup
  positions: Position[] = []
  loading = false
  positionId = null
  modal: MaterialInstance

  constructor(private positionsService: PositionsService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    })
    this.loading = true
    this.positionsService.fetch(this.categoryId).subscribe(
      positions => {
        this.loading = false
        this.positions = positions
      },
    )
  }

  ngOnDestroy(): void {
    this.modal.destroy()
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open()
    MaterialService.updateTextInput()
  }

  onAddPosition() {
    this.positionId = null
    this.form.patchValue({
      name: null,
      cost: 1
    })
    this.modal.open()
    MaterialService.updateTextInput()
  }

  onCancel() {
    this.modal.close()
  }


  onSubmit() {
    this.form.disable()
    const position: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId,
    }
    const completed = () => {
      this.form.enable()
      this.form.reset({name: '', cost: 1})
      this.modal.close()
    }
    if (this.positionId) {
      position._id = this.positionId
      this.positionsService.update(position).subscribe(
        pos => {
          const idx = this.positions.findIndex(p => p._id === pos._id)
          this.positions[idx] = pos
          MaterialService.toast('Position is changed')
          this.positions.push(pos)
        },
        error => {
          MaterialService.toast(error.error.message)
        },
        completed
      )
    } else {
      this.positionsService.create(position).subscribe(
        pos => {
          MaterialService.toast('Position is created')
          this.positions.push(pos)
        },
        error => {
          MaterialService.toast(error.error.message)
        },
        completed
      )
    }


  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation()
    const decision = window.confirm(`Remove ${position.name}?`)
    if (decision) {
      this.positionsService.delete(position).subscribe(
        (response) => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions.splice(idx, 1)
          MaterialService.toast(response.message)
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }
}
