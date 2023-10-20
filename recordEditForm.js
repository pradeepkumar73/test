import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions'; 
import LightningAlert from 'lightning/alert';
export default class RecordEditForm extends LightningElement {
    @api recordId;
    flag = false;
    connectedCallback() {
        LightningAlert.open({
            message: 'Please review and update \'Actual End Date\' of the placement record',
            theme: 'error', // a red theme intended for error states label: 'Error!', // this is the header text 
        });
    }
    checkDateValue(event) {
        let dd = event.detail.value;
        if ((new Date(dd).getDate() == new Date().getDate() || new Date(dd).getDate() > new Date().getDate())
            && (new Date(dd).getMonth() == new Date().getMonth() || new Date(dd).getDate() > new Date().getMonth())
            && (new Date(dd).getFullYear() == new Date().getFullYear() || new Date(dd).getFullYear() > new Date().getFullYear())) {
            this.flag = true;
        }
        console.log(JSON.stringify(event.detail));
        console.log(this.flag);
    }
    handleSubmit(event) {
        event.preventDefault(); // stop the form from submitting 
        const fields = event.detail.fields;
        console.log('Test 1' + JSON.stringify(fields));
        let jobStatusValue = fields.ATS_PlacementStatus__c;
        let statusFlag = false;
        if (jobStatusValue == 'Termination' || jobStatusValue == 'Contract Expiry') {
            statusFlag = true;
        }
        console.log('Test ' + jobStatusValue);
        if (statusFlag && !this.flag) {
            LightningAlert.open({
                message: 'Please review and update \'Actual End Date\' of the placement record',
                theme: 'error', // a red theme intended for error states label: 'Error!', // this is the header text 
            }).then(()=>{
                console.log("###Alert Closed");
                let key='ATS_ActualEndDate__c';
                const inputFields = this.template.querySelectorAll('lightning-input-field');
                if (inputFields) {
                    inputFields.forEach(field => {
                        console.log('Field is==> ' + field.fieldName);
                        console.log('Field is==> ' + field.value);
                        if(field.fieldName==key)
                        {
                            field.scrollIntoView();
                            field.focus();
                        }
                    });
                }
                //const input = this.template.querySelector('lightning-input-field[field-name=${key}]');
                
                        // Scroll to the input element and focus on it
                       // input.scrollIntoView();
                        //input.focus();
                
                        // Return from the function
                        return;
            });
        }
        else {
            this.template.querySelector('lightning-record-edit-form').submit(fields); const evt = new ShowToastEvent({
                title: 'success',
                message: 'Record Saved Successfully',
                variant: 'success',
            });
            this.dispatchEvent(evt);
            this.dispatchEvent(new CloseActionScreenEvent());
        }
    }
    handleCancel(event) {
        this.dispatchEvent(new CloseActionScreenEvent());
    }
}
