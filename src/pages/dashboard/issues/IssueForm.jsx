import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import SelectField from '../../../components/form_elements/SelectField';
import { TextAreaField, InputField, BrowseFileField } from '../../../components/form_elements/FormFields';
import Button from '../../../components/ui/button/Button';
import useUI from '../../../contexts/UIContext';
import { CloseIcon } from '../../../assets/Icons/Icons';


export default function IssueForm({ submitMutation, formData, formType }) {
    const { register, watch, control, formState: { errors }, handleSubmit, setValue } = formData ? useForm({
        defaultValues: {
            ...formData,
        }
    }) : useForm();
    const { closeOverlay } = useUI();


    const onlyView = formType === "view";

    async function onSubmit(data) {
        if (submitMutation.isLoading) return;
        submitMutation.mutate(data);
    }

    const watchType = watch('issue_type');


    return (
        <div className='w-full bg-body-900 mx-auto text-text p-3 md:p-6 shadow-md rounded-xl'>
            <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col gap-6'>

                <InputField
                    disabled={onlyView}
                    errors={errors}
                    name={"title"}
                    placeholder={"Issue Title"}
                    title={"Title"}
                    register={register}
                    validationSchema={{
                        required: "Title is required",
                    }}
                    type='text'
                />



                <SelectField
                    disabled={onlyView}
                    control={control}
                    name={"issue_type"}
                    options={[
                        { value: 'web', label: 'Web' },
                        { value: 'app', label: 'App' },
                    ]}
                    title={"Type"}
                    placeholder='Select...'
                    rules={{
                        required: "Select Issue Type!",
                    }}
                />

                {watchType === 'web' &&

                    <InputField
                        disabled={onlyView}
                        errors={errors}
                        name={"url"}
                        placeholder={"URL of Page"}
                        title={"Mention URL"}
                        register={register}
                        type='text'
                    />

                }

                <TextAreaField
                    disabled={onlyView}
                    errors={errors}
                    name={"description"}
                    placeholder={"Describe the issue"}
                    register={register}
                    title={"Description"}
                    validationSchema={{
                        required: "Description is required!", maxLength: {
                            value: 251,
                            message: "Max Length is 251!"
                        }
                    }}
                />

                {
                    formData?.["oldMedia"] &&

                    <OldImagesField
                        data={formData["oldMedia"]}
                        setValue={setValue}
                    />
                }



                <BrowseFileField
                    errors={errors}
                    name={"media"}
                    register={register}
                    title={"Screen Proof"}
                />



                <div className='flex gap-4 ml-auto'>

                    {
                        <Button
                            onClick={closeOverlay}
                            variant='red'>
                            Cancel
                        </Button>
                    }

                    {
                        !onlyView && <Button
                            disabled={submitMutation.isLoading || submitMutation.isSuccess}
                            type='submit'
                            className="text-sm font-medium disabled:animate-pulse"
                        >
                            {formType === "edit" ? "Save Changes" : "Submit"}
                        </Button>
                    }



                </div>


            </form>
        </div>

    )
}

function OldImagesField({ data, setValue }) {

    const [imageData, setImageData] = useState(data);

    function removeImage(imageLink) {
        let arr = imageData.filter(link => imageLink !== link);
        setImageData(arr);
        setValue("oldMedia", arr);

    }
    if (!imageData.length) return null;
    return (

        <div className='flex flex-col gap-3'>
            <span>Old Images</span>
            {
                imageData.map((imageLink, index) => (

                    <span
                        className='flex justify-between py-2 px-3 bg-body-800 items-center rounded-lg'
                        key={imageLink}
                    >
                        <a
                            className='hover:underline underline-offset-4'
                            href={imageLink}

                            target="_blank"
                        >

                            {imageLink.substring(imageLink.lastIndexOf("/") + 1)}
                        </a >

                        <button
                            type='button'
                            onClick={removeImage.bind(null, imageLink)}
                        >
                            <CloseIcon
                                className='hover:text-red-600'
                                title='remove image'
                            />
                        </button>
                    </span>
                ))
            }
        </div>
    )
}