import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { DialogConfirmationDeleteComponent } from 'src/app/components/dialog-confirmation-delete/dialog-confirmation-delete.component';
import { DemandeDeStage } from 'src/app/models';
import { DemandeDeStageService } from 'src/app/services/demande-de-stage/demande-de-stage.service';
import { EntrepriseService } from 'src/app/services/entreprise/entreprise.service';

@Component({
  selector: 'app-demande-de-stage',
  templateUrl: './demande-de-stage.component.html',
  styleUrls: ['./demande-de-stage.component.scss'],
})
export class DemandeDeStageComponent {
  demandeDeStage$!: Observable<{ success: boolean; data?: DemandeDeStage }>;
  demandeDeStage: DemandeDeStage | null = null;
  requirments: Array<{ label: string; field: keyof DemandeDeStage }> = [
    { label: 'Programme de formation', field: 'program' },
    { label: "Établissement d'enseignement", field: 'enterprise' },
    { label: "Secteur d'activité", field: 'activitySector' },
    { label: 'Ville', field: 'city' },
    { label: 'Compétences', field: 'skills' },
    { label: 'Région', field: 'region' },
  ];

  stageInfo: Array<{ label: string; field: keyof DemandeDeStage }> = [
    { label: 'Type de stage', field: 'stageType' },
    { label: 'Date de début', field: 'startDate' },
    { label: "Nombre d'heures par semaine", field: 'hoursPerWeek' },
    { label: 'Date de fin', field: 'endDate' },
    { label: 'Rémunération', field: 'paid' },
  ];

  constructor(
    private route: ActivatedRoute,
    private demandeDeStageService: DemandeDeStageService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.demandeDeStage$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        if (id) {
          return this.demandeDeStageService.getDemandeDeStage(id);
        }
        return this.demandeDeStage$;
      })
    );

    this.demandeDeStage$.subscribe((demandeDeStage) => {
      if (demandeDeStage.data) {
        this.demandeDeStage = demandeDeStage.data;
      }
    });
  }

  getEntrepriseFieldValue(key: keyof DemandeDeStage): string {
    const value = this.demandeDeStage![key];
    if (typeof value !== 'string') return '';
    return value;
  }

  openDialog(id: string) {
    const dialogRef = this.dialog.open(DialogConfirmationDeleteComponent, {
      data: {
        service: 'demandeDeStage',
        id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this._snackBar.open(result, undefined, {
        duration: 2000,
      });
    });
  }
}
