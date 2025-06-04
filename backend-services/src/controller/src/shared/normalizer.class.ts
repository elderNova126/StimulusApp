import { Observable, Subject } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { ActionTypes } from '../shared/action-types.options';

export abstract class NormalizerStreamLogic {
  protected abstract readonly logger: StimulusLogger;

  protected handleActionBasedStream(
    field,
    message: Observable<any>,
    createHandler,
    updateHandler,
    deleteHandler,
    endHandler?,
    savingQuantity?
  ): Observable<any> {
    this.logger.debug(`handleActionBasedStream ${field}`);
    this.logger.debug(JSON.stringify(message, null, 2));
    let numberOfItems = 0;
    const companiesIds = [];
    let elementsAdd = [];
    let elementsToDelete = [];
    const subject = new Subject<any>();
    this.logger.debug(`Start message pipe`);
    message
      .pipe(
        map((msg) => {
          this.logger.debug('in map');
          this.logger.debug(JSON.stringify(msg, null, 2));
          numberOfItems++;
          return msg;
        }),
        concatMap(async (msg: any) => {
          this.logger.debug('in concatMap');
          const { action, ...data } = msg;
          const element: any = data[field];
          // Keep track of all the companies that part of the ingestion process.
          // Send the list with all the companies ids to the endHandler.
          if (element) {
            if ('company' in element) companiesIds.push(element.company.internalId);
            else if ('project' in element) {
              if ('projectCompany' in element.project)
                for (const projectCompany of element.project.projectCompany) {
                  companiesIds.push(projectCompany.companyId);
                }
            }
          }
          if (msg.hasOwnProperty('action')) {
            switch (action) {
              case ActionTypes.ADD:
                this.logger.debug(JSON.stringify(element, null, 2));
                try {
                  if ('project' in element || msg.hasOwnProperty('industry')) {
                    elementsAdd.push(element);
                    if (Number(elementsAdd.length) >= Number(savingQuantity)) {
                      await createHandler(elementsAdd);
                      elementsAdd = [];
                    }
                  } else {
                    elementsAdd.push(element);
                    if (elementsAdd.length > 100) {
                      await createHandler(elementsAdd);
                      elementsAdd = [];
                    }
                  }
                } catch (error) {
                  this.logger.error(`Error for action add: ${error}`);
                }
                break;
              case ActionTypes.DELETE:
                this.logger.debug('DELETE');
                this.logger.debug(JSON.stringify(element, null, 2));
                try {
                  if (field === 'company') {
                    elementsToDelete.push(element.internalId ? element.internalId : element);
                    if (elementsToDelete.length > 100) {
                      await deleteHandler(elementsToDelete);
                      elementsToDelete = [];
                    }
                  } else {
                    await deleteHandler(elementsToDelete);
                  }
                } catch (error) {
                  this.logger.error(`Error for action delete: ${error}`);
                }
                break;
              case ActionTypes.UPDATE:
                this.logger.debug('UPDATE');
                this.logger.debug(JSON.stringify(element, null, 2));
                const { internalId, ...rest } = element;
                try {
                  await updateHandler(internalId, rest);
                } catch (error) {
                  this.logger.error(`Error for action update: ${error}`);
                }
                break;
              case ActionTypes.END:
                this.logger.debug('END');
                try {
                  if (elementsAdd.length !== 0) await createHandler(elementsAdd);
                  if (elementsToDelete.length !== 0) await deleteHandler(elementsToDelete);
                  if (endHandler) await endHandler(companiesIds);
                } catch (error) {
                  this.logger.error(`Error for action end: ${error}`);
                } finally {
                  subject.next({
                    message: 'Close',
                    number: numberOfItems,
                  });
                  subject.complete();
                }
                break;
            }
          }
        })
      )
      .subscribe(
        (msg) => {
          this.logger.debug(`Msg is ${msg}`);
        },
        (error) => {
          this.logger.error(error);
          subject.error(error);
        },
        () => {
          subject.next({
            message: 'All data received',
            number: numberOfItems,
          });
          this.logger.debug('All data received');
          subject.complete();
          this.logger.debug('Complete');
        }
      );
    return subject.asObservable();
  }
}
