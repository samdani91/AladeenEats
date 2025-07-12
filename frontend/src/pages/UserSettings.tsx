/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const UserSettings: React.FC = () => {
  const { user, updatePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [deletePassword, setDeletePassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    try {
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const message = 'Failed to update password. Please try again.';
      toast.error(message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      await deleteAccount({ password: deletePassword });
      toast.success('Account deleted successfully.');
      setIsDialogOpen(false);
      navigate('/');
    } catch (error) {
      const message = 'Failed to delete account. Please check your password.';
      toast.error(message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please sign in</h2>
          <p className="text-gray-600">You need to be signed in to view your settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Settings</h1>

        <Tabs defaultValue="change-password" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="change-password">Change Password</TabsTrigger>
            <TabsTrigger value="delete-account">Delete Account</TabsTrigger>
          </TabsList>

          {/* Change Password */}
          <TabsContent value="change-password" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div> {/* Added a new div for correct relative positioning */}
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative"> {/* Made this div relative */}
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                        }
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                        style={{ top: '50%', transform: 'translateY(-50%)' }} // Ensured vertical centering
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <div> {/* Added a new div for correct relative positioning */}
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative"> {/* Made this div relative */}
                      <Input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                        }
                        required
                        className="pr-10" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                        style={{ top: '50%', transform: 'translateY(-50%)' }} // Ensured vertical centering
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <div> {/* Added a new div for correct relative positioning */}
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative"> {/* Made this div relative */}
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                        }
                        required
                        className="pr-10" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                        style={{ top: '50%', transform: 'translateY(-50%)' }} // Ensured vertical centering
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit">Update Password</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delete Account */}
          <TabsContent value="delete-account" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Delete Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action is permanent and cannot be undone. Please enter your password to confirm.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4">
                      <div> {/* Added a new div for correct relative positioning */}
                        <Label htmlFor="delete-password">Password</Label>
                        <div className="relative"> {/* Made this div relative */}
                          <Input
                            id="delete-password"
                            type={showDeletePassword ? 'text' : 'password'}
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            required
                            className="pr-10" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowDeletePassword(!showDeletePassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                            style={{ top: '50%', transform: 'translateY(-50%)' }} // Ensured vertical centering
                          >
                            {showDeletePassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} disabled={!deletePassword}>
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserSettings;